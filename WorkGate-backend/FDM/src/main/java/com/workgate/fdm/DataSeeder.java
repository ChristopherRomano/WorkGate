package com.workgate.fdm;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import com.workgate.fdm.model.*;;

@Component
public class DataSeeder {

    @PostConstruct
    public void seed() {
        Registry reg = Registry.getRegistry();

        // employee — Alex Turner
        Employee alex = new Employee("a.turner@fdmgroup.com", "pass");
        alex.setId("u001");
        alex.setUsername("employee");
        alex.setName("Alex Turner");
        alex.setInitials("AT");
        alex.setTag(TAG.BENCH);
        alex.setAnnualLeaveBalance(20);
        reg.addUser(alex);

        // consultant — Jamie Chen
        Consultant jamie = new Consultant("j.chen@fdmgroup.com", "pass");
        jamie.setId("u002");
        jamie.setUsername("consultant");
        jamie.setName("Jamie Chen");
        jamie.setInitials("JC");
        jamie.setTag(TAG.DEPLOYED);
        jamie.setClientCode("CLIENT-003");
        jamie.setAnnualLeaveBalance(15);
        reg.addUser(jamie);

        // manager — Sarah O'Brien
        Manager sarah = new Manager("s.obrien@fdmgroup.com", "pass");
        sarah.setId("u003");
        sarah.setUsername("manager");
        sarah.setName("Sarah O'Brien");
        sarah.setInitials("SO");
        sarah.setTag(TAG.MANAGER);
        sarah.setTeamCode("TEAM-A");
        sarah.setAnnualLeaveBalance(18);
        reg.addUser(sarah);

        // assign manager to employee and consultant
        alex.setManager(sarah);
        jamie.setManager(sarah);

        // ittech — Dev Patel
        ItTechnician dev = new ItTechnician("d.patel@fdmgroup.com", "pass");
        dev.setId("u004");
        dev.setUsername("ittech");
        dev.setName("Dev Patel");
        dev.setInitials("DP");
        dev.setTag(TAG.IT);
        reg.addUser(dev);

        // hr — Maya Singh
        HrRep maya = new HrRep("m.singh@fdmgroup.com", "pass");
        maya.setId("u005");
        maya.setUsername("hr");
        maya.setName("Maya Singh");
        maya.setInitials("MS");
        maya.setTag(TAG.HR);
        reg.addUser(maya);

        // admin — Chris Morgan
        Administrator chris = new Administrator("c.morgan@fdmgroup.com", "pass");
        chris.setId("u006");
        chris.setUsername("admin");
        chris.setName("Chris Morgan");
        chris.setInitials("CM");
        reg.addUser(chris);
    }

}
